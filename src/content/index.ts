export {};

const main = async () => {
    const data = await chrome.storage.sync.get('foo');
    console.log(data);
};

main();
