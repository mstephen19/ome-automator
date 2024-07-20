type Awaitable<T> = T | Promise<T>;

const memCache =
    <Data>(initialize: () => Awaitable<Data>) =>
    () => {};
