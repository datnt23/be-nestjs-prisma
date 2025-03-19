//  ['a','b']=>{a:true, b:true}
export const getSelectData = (
  select: string[] = [],
): Record<string, boolean> => {
  return Object.fromEntries(select.map((el) => [el, true]));
};
//  ['a','b']=>{a:false, b:false}
export const getUnSelectData = (
  select: string[] = [],
): Record<string, boolean> => {
  return Object.fromEntries(select.map((el) => [el, false]));
};
