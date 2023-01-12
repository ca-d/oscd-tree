/* eslint-disable @typescript-eslint/no-unused-vars */
import { TreeSelection } from './oscd-tree.js';
import { cyrb64 } from './cyrb64.js';

const data = await fetch('/data.json').then(r => r.json());

const types = new Map<string, Element>();

function hashElement(element: Element): string {
  if (element.tagName === 'EnumType') {
    const vals: Record<string, string> = {};
    for (const val of Array.from(element.children)
      .filter(child => child.tagName === 'EnumVal')
      .sort(
        (v1, v2) =>
          parseInt(v1.getAttribute('ord') ?? '', 10) -
          parseInt(v2.getAttribute('ord') ?? '', 10)
      ))
      vals[val.getAttribute('ord') ?? ''] = val.textContent ?? '';
    const fingerprint = JSON.stringify({ vals });
    return cyrb64(fingerprint);
  }
  return 'UNHASHABLE';
}

export function generateTemplates(
  selection: TreeSelection,
  doc: XMLDocument
): {
  enumTypes: Set<Element>;
  daTypes: Set<Element>;
  doTypes: Set<Element>;
  lnTypes: Set<Element>;
} {
  const enumTypes = new Set<Element>();
  const daTypes = new Set<Element>();
  const doTypes = new Set<Element>();
  const lnTypes = new Set<Element>();
  console.log(selection);

  function addEnumType(path: string[], sel: TreeSelection): string {
    let d = data;
    for (const slug of path) d = d[slug].dependencies;

    const vals = [];

    for (const content of Object.keys(sel)) {
      const ord = d[content].literalVal;
      const val = doc.createElement('EnumVal');
      val.setAttribute('ord', ord);
      val.textContent = content;
      vals.push(val);
    }

    const enumType = doc.createElement('EnumType');
    vals.forEach(val => enumType.append(val));

    const hash = hashElement(enumType);
    const id = `${path[path.length - 1]}$${hash}`;
    enumType.setAttribute('id', id);
    if (!types.has(id)) types.set(id, enumType);
    enumTypes.add(enumType);

    return id;
  }

  function addDAType(path: string[], sel: TreeSelection): string {
    let d = data;
    for (const slug of path.slice(0, -1)) d = d[slug].dependencies;
    const {
      typeKind,
      dchg,
      dupd,
      qchg,
      type: bType,
      name,
      fc,
    } = d[path[path.length - 1]];

    if (typeKind !== 'CONSTRUCTED')
      console.error('can only add DATypes for CONSTRUCTED attributes');

    return '';
  }

  function addDOType(path: string[], sel: TreeSelection): string {
    let d = data;
    for (const slug of path.slice(0, -1)) d = d[slug].dependencies;

    const dO = d[path[path.length - 1]];

    const deps: [string, { tagName: string; transient?: string }][] =
      Object.entries(dO.dependencies);

    for (const [name, dep] of deps) {
      if (dep.tagName === 'SubDataObject') {
        const sdo = doc.createElement('SDO');
        sdo.setAttribute('name', name);
        if (dep.transient) sdo.setAttribute('transient', dep.transient);
        const doHash = addDOType(path.concat([name]), sel[name]);
        sdo.setAttribute('type', doHash);
      } else {
        const da = doc.createElement('DA');
        da.setAttribute('name', name);
        const daHash = addDAType(path.concat([name]), sel[name]);
        da.setAttribute('type', daHash);
      }
    }
    return '';
  }

  function addLNType(path: string[], sel: TreeSelection): string {
    const [name] = path;
    const ln = data[name];
    const dos = new Set<Element>();

    Object.keys(sel).forEach(dO => {
      const doHash = addDOType(path.concat([dO]), sel[dO]);
      const doElement = doc.createElement('DO');
      const trans = ln.dependencies[dO].transient;
      doElement.setAttribute('name', dO);
      doElement.setAttribute('type', doHash);
      if (trans) doElement.setAttribute('transient', trans);
    });

    const lnType = doc.createElement('LNType');

    dos.forEach(dO => lnType.appendChild(dO));
    lnType.setAttribute('lnClass', name);

    const hash = hashElement(lnType);
    const id = `${name}$${hash}`;
    lnType.setAttribute('id', id);
    if (!types.has(id)) types.set(id, lnType);
    return id;
  }

  Object.entries(selection).forEach(([name, sel]) => addLNType([name], sel));

  return { enumTypes, daTypes, doTypes, lnTypes };
}
