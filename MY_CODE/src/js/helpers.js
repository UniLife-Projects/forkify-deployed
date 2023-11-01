// A module independent of the MVC architecture

import { TIMEOUT_SEC } from "./config";

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// Combining getJSON() + sendJSON()
export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchedResult = uploadData
      ? fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const result = await Promise.race([fetchedResult, timeout(TIMEOUT_SEC)]);
    console.log(result);

    const data = await result.json();
    console.log(data);

    if (!result.ok)
      throw new Error(
        `Helper.js getJSON(): ${data.message} (${result.status})`
      );

    return data;
  } catch (error) {
    throw error;
  }
}

/*
export async function getJSON(url) {
  try {
    // const result = await fetch(url);
    const result = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    console.log(result);

    const data = await result.json();
    console.log(data);

    if (!result.ok)
      throw new Error(
        `Helper.js getJSON(): ${data.message} (${result.status})`
      );

    return data;
  } catch (error) {
    console.error(`HELPER.js getJSON(): ${error}`);
    throw error;
  }
}

export async function sendJSON(url, uploadData) {
  try {
    // const result = await fetch(url);
    const result = await Promise.race([
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(uploadData),
      }),
      timeout(TIMEOUT_SEC),
    ]);
    console.log(result);

    const data = await result.json();
    console.log(data);

    if (!result.ok)
      throw new Error(
        `Helper.js getJSON(): ${data.message} (${result.status})`
      );

    return data;
  } catch (error) {
    console.error(`HELPER.js getJSON(): ${error}`);
    throw error;
  }
}
*/
