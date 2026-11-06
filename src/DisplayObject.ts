import { ReactElement } from 'react';
import ReactDOM from 'react-dom';

const displayObjectCacheHelper = new WeakMap<HTMLElement, DisplayObject>();

export default class DisplayObject extends Object {
  private _container: HTMLElement;
  /**
   * 用于存放子元素的容器
   * @returns {*}
   */
  get container() {
    return this._container;
  }
  private _reactContainer?: HTMLElement;
  /**
   * 用于存放 React 组件
   */
  private _reactElement?: ReactElement;

  constructor(reactElement?: ReactElement) {
    super();

    this._container = document.createElement('div');

    this._reactElement = reactElement;

    if (this._reactElement) {
      this._reactContainer = this.container.appendChild(
        document.createElement('div')
      );
    }

    displayObjectCacheHelper.set(this.container, this);
  }

  async startup(container?: HTMLElement) {
    (container ?? document.body).appendChild(this.container);
    await this.onAdded();
  }

  async remove() {
    this.container.remove();
    await this.onRemoved();
  }

  protected onAdded() {
    return new Promise<void>(resolve => {
      if (this._reactElement) {
        ReactDOM.render(this._reactElement!, this._reactContainer!, () =>
          resolve()
        );
      } else {
        resolve();
      }
    });
  }

  protected onRemoved() {
    return new Promise<void>(resolve => {
      if (this._reactElement) {
        ReactDOM.unmountComponentAtNode(this._reactContainer!);
      }
      resolve();
    });
  }

  async addChild(child: DisplayObject) {
    if (child) {
      this.container.appendChild(child.container);
      await child.onAdded();
    }
    return child;
  }

  async addChildAt(child: DisplayObject, index: number) {
    const children = this.container.children;
    if (index >= children.length) {
      await this.addChild(child);
    } else {
      if (child) {
        this.container.insertBefore(child.container, children[index]);
        await child.onAdded();
      }
    }
    return child;
  }

  getChildAt(index: number) {
    const children = this.container.children;
    let child;
    if (children.length > 0) {
      const container = children[index] as HTMLElement;
      child = displayObjectCacheHelper.get(container);
    }
    return child;
  }

  getChildIndex(child: DisplayObject) {
    const children = this.container.children;
    for (let i = 0; i < children.length; i++) {
      if ((children[i] as HTMLElement) === child.container) return i;
    }
    return -1;
  }

  async removeChild(child: DisplayObject) {
    if (this.container.contains(child.container)) {
      this.container.removeChild(child.container);
      await child.onRemoved();
    }
    return child;
  }

  async removeChildAt(index: number) {
    const child = this.getChildAt(index);
    if (child) {
      await this.removeChild(child);
    }
    return child;
  }
  async removeChildren(beginIndex = 0, endIndex = -1) {
    const children = this.container.children;
    if (endIndex === -1 || endIndex > children.length - 1) {
      endIndex = children.length - 1;
    }
    const elements = [];
    for (let i = endIndex; i >= beginIndex; i--) {
      const child = this.getChildAt(i)!;
      await this.removeChild(child);
      elements.push(child);
    }
    return elements;
  }

  get numChildren() {
    return this.container.children.length;
  }

  get parent() {
    const parentElement = this.container.parentElement;
    if (parentElement) {
      return displayObjectCacheHelper.get(parentElement);
    }
    return undefined;
  }

  get stage(): DisplayObject | undefined {
    let current: DisplayObject = this;
    let prev = current.parent;
    while (prev) {
      current = prev;
      prev = prev.parent;
    }
    return current;
  }
}
