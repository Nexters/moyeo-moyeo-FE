export const downloadCsv = (fileName: string, fileContentArray: string[][]) => {
  const fileContent = fileContentArray.map((row) => row.join(',')).join('\n');
  const blob = new Blob([fileContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

export const downloadTsv = (fileName: string, fileContentArray: string[][]) => {
  const fileContent = fileContentArray.map((row) => row.join('\t')).join('\n');
  const blob = new Blob([fileContent], { type: 'text/tsv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.tsv`;
  a.click();
  URL.revokeObjectURL(url);
};
