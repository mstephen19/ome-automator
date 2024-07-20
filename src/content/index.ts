export {};

const main = async () => {
    const data = await chrome.storage.local.get('foo');
    console.log(data);
};

main();
