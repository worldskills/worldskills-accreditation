export function createDownloadLink(res: Blob, filename: string) {
  let blob: any = new Blob([res], {type: res.type});
  const url = window.URL.createObjectURL(blob);

  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.target = '_blank';

  downloadLink.setAttribute('download', filename);
  document.body.appendChild(downloadLink);
  downloadLink.click();
}
