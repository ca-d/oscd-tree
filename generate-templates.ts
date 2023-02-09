/* eslint-disable @typescript-eslint/no-unused-vars */
import { TreeSelection } from './oscd-tree.js';
import { cyrb64 } from './cyrb64.js';

const data = await fetch('/tree.json').then(r => r.json());

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
  return cyrb64(element.outerHTML);
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
  const types = new Set<string>();

  const enumTypes = new Set<Element>();
  const daTypes = new Set<Element>();
  const doTypes = new Set<Element>();
  const lnTypes = new Set<Element>();
  console.log(selection);

  function addEnumType(path: string[], sel: TreeSelection): string {
    let d = data;
    for (const slug of path) d = d[slug].children;

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
    if (!types.has(id)) {
      types.add(id);
      enumTypes.add(enumType);
    }

    return id;
  }

  function addDAType(
    path: string[],
    sel: TreeSelection,
    stValSel: TreeSelection = {}
  ): string {
    let d = data;
    for (const slug of path.slice(0, -1)) d = d[slug].children;
    const {
      children,
      tagName,
      underlyingTypeKind,
      underlyingType,
      typeKind,
      dchg,
      dupd,
      qchg,
      type: bType,
      fc,
    } = d[path[path.length - 1]];

    if (typeKind !== 'CONSTRUCTED')
      throw new Error(`DAType typeKind is not CONSTRUCTED, but ${typeKind}`);

    const daType = doc.createElement('DAType');

    for (const [name, dep] of Object.entries(children) as [
      string,
      {
        tagName: string;
        transient?: string;
        fc: string;
        dchg?: string;
        dupd?: string;
        qchg?: string;
        typeKind?: 'BASIC' | 'ENUMERATED' | 'CONSTRUCTED' | 'undefined';
        type?: string;
      }
    ][]) {
      // eslint-disable-next-line no-continue
      if (!sel[name]) continue;
      const bda = doc.createElement('BDA');
      bda.setAttribute('name', name);
      if (dep.dchg) bda.setAttribute('dchg', dep.dchg);
      if (dep.dupd) bda.setAttribute('dupd', dep.dupd);
      if (dep.qchg) bda.setAttribute('qchg', dep.qchg);
      if (dep.typeKind === 'BASIC' || !dep.typeKind) {
        bda.setAttribute('bType', dep.type ?? '');
      }
      if (dep.typeKind === 'ENUMERATED') {
        const enumHash = addEnumType(path.concat([name]), sel[name]);
        bda.setAttribute('bType', 'Enum');
        bda.setAttribute('type', enumHash);
      }
      if (dep.typeKind === 'undefined') {
        if (underlyingTypeKind === 'BASIC')
          bda.setAttribute('bType', underlyingType);
        else if (underlyingTypeKind === 'ENUMERATED') {
          const { stVal } = d;
          const enumHash = addEnumType(
            path.slice(0, -1).concat(['stVal']),
            stValSel
          );
          bda.setAttribute('bType', 'Enum');
          bda.setAttribute('type', enumHash);
        } else
          throw new Error(
            `Unexpected underlyingTypeKind ${underlyingTypeKind}`
          );
      }
      if (dep.typeKind === 'CONSTRUCTED') {
        const daHash = addDAType(path.concat([name]), sel[name]);
        bda.setAttribute('bType', 'Struct');
        bda.setAttribute('type', daHash);
      }
      daType.append(bda);
    }

    /*
    const da = doc.createElement(
      ['DataAttribute', 'ServiceDataAttribute'].includes(tagName) ? 'DA' : 'BDA'
    );

    da.setAttribute('name', name);
    if (fc) da.setAttribute('fc', fc);
    if (dchg) da.setAttribute('dchg', dchg);
    if (dupd) da.setAttribute('dupd', dupd);
    if (qchg) da.setAttribute('qchg', qchg);
    if (!typeKind || typeKind === 'BASIC') da.setAttribute('bType', bType);
    if (typeKind === 'CONSTRUCTED') {
      da.setAttribute('bType', 'Struct');
      const daHash = addDAType(path.concat([name]), sel[name]);
      da.setAttribute('type', daHash);
    }
     */
    const hash = hashElement(daType);
    const id = `${path[path.length - 1]}$${hash}`;
    daType.setAttribute('id', id);
    if (!types.has(id)) {
      types.add(id);
      daTypes.add(daType);
    }

    return id;
  }

  function addDOType(path: string[], sel: TreeSelection): string {
    if (!sel)
      throw new Error(
        `adding DO type for empty selection at ${JSON.stringify(path, null, 2)}`
      );
    let d = data;
    for (const slug of path.slice(0, -1)) d = d[slug].children;

    const dO = d[path[path.length - 1]];
    const doType = doc.createElement('DOType');
    doType.setAttribute('cdc', dO.type);

    const deps: [
      string,
      {
        tagName: string;
        transient?: string;
        fc: string;
        dchg?: string;
        dupd?: string;
        qchg?: string;
        typeKind?: 'BASIC' | 'ENUMERATED' | 'CONSTRUCTED' | 'undefined';
        type?: string;
      }
    ][] = Object.entries(dO.children);

    for (const [name, dep] of deps) {
      // eslint-disable-next-line no-continue
      if (!sel[name]) continue;
      if (dep.tagName === 'SubDataObject') {
        const sdo = doc.createElement('SDO');
        sdo.setAttribute('name', name);
        if (dep.transient) sdo.setAttribute('transient', dep.transient);
        const doHash = addDOType(path.concat([name]), sel[name]);
        sdo.setAttribute('type', doHash);
        doType.prepend(sdo);
      } else {
        const da = doc.createElement('DA');
        da.setAttribute('name', name);
        da.setAttribute('fc', dep.fc);
        if (dep.dchg) da.setAttribute('dchg', dep.dchg);
        if (dep.dupd) da.setAttribute('dupd', dep.dupd);
        if (dep.qchg) da.setAttribute('qchg', dep.qchg);
        if (dep.typeKind === 'BASIC' || !dep.typeKind) {
          da.setAttribute('bType', dep.type ?? '');
        }
        if (dep.typeKind === 'ENUMERATED') {
          const enumHash = addEnumType(path.concat([name]), sel[name]);
          da.setAttribute('bType', 'Enum');
          da.setAttribute('type', enumHash);
        }
        if (dep.typeKind === 'CONSTRUCTED') {
          const daHash = addDAType(path.concat([name]), sel[name], sel.stVal);
          da.setAttribute('bType', 'Struct');
          da.setAttribute('type', daHash);
        }
        doType.append(da);
      }
    }
    const hash = hashElement(doType);
    const id = `${path[path.length - 1]}$${hash}`;
    doType.setAttribute('id', id);
    if (!types.has(id)) {
      types.add(id);
      doTypes.add(doType);
    }

    return id;
  }

  function addLNType(path: string[], sel: TreeSelection): string {
    const [name] = path;
    const ln = data[name];

    const lnType = doc.createElement('LNType');

    Object.keys(sel).forEach(dO => {
      const doHash = addDOType(path.concat([dO]), sel[dO]);
      const doElement = doc.createElement('DO');
      const trans = ln.children[dO].transient;
      doElement.setAttribute('name', dO);
      doElement.setAttribute('type', doHash);
      if (trans) doElement.setAttribute('transient', trans);
      lnType.append(doElement);
    });

    lnType.setAttribute('lnClass', name);

    const hash = hashElement(lnType);
    const id = `${name}$${hash}`;
    lnType.setAttribute('id', id);
    if (!types.has(id)) {
      types.add(id);
      lnTypes.add(lnType);
    }

    return id;
  }

  Object.entries(selection).forEach(([name, sel]) => addLNType([name], sel));

  console.log(enumTypes, daTypes, doTypes, lnTypes);
  return { enumTypes, daTypes, doTypes, lnTypes };
}
