/**
 * new Response(body, {
 *  status: 200,
 *  statusText: 'OK',
 *  headers: {
 *    'x-my-headers': 'value',
 *  },
 * });
 * body - Blob, File, ArrayBuffer, TypedArray, DataView, FormData, String, URLSearchParams
 */

document.addEventListener('DOMContentLoaded', () => {
  createJSONResponse();
  createImageResponse();
});

async function createJSONResponse() {
  let body = {
    id: Date.now(),
    name: 'dev',
    skills: ['volley', 'code'],
  };
  body = JSON.stringify(body);
  let file = new File([body], 'data.json', { type: 'application/json' });
  console.log(file);
  const response = new Response(file, {
    status: 200,
    statusText: 'OK',
    headers: {
      'x-header-name': 'value',
      'content-type': file.type,
      'content-length': file.size,
    },
  });

  const copy = response.clone();
  console.log(await copy.json());
}
function createImageResponse() {
  let input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async (e) => {
    let fileSelector = e.target;
    let file = fileSelector.files[0];
    const response = new Response(file, {
      status: 200,
      statusText: 'DOWNLOADED',
      headers: {
        'content-type': file.type,
        'content-length': file.size,
      },
    });

    const copy = response.clone();
    const blob = await copy.blob();
    const url = URL.createObjectURL(blob);

    let img = document.createElement('img');
    img.src = url;
    console.log(url);
    document.querySelector('output').append(img);
  });
  document.body.addEventListener('click', () => {
    input.click();
  });
}

/**NOTE: diff between blob and file is that generally file has mimetype and file name attached to it */
