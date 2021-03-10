# displayobject

基于 **React** 的 **面向对象包装器**

```js
import DisplayObject from 'displayobject';

const app = new DisplayObject((<App />));
app.startup(document.getElementById('root'));

const child1 = new DisplayObject((<Child1 />));
app.addChild(child1);

const child2 = new DisplayObject((<Child2 />));
app.addChild(child2);
```
