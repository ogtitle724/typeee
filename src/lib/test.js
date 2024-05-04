export default async function sendReq(url, option) {
  try {
    const result = await fetch(url, option);
  } catch (err) {
    console.error(err.message);
  }
}
