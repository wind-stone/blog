/**
 * 堆的实现，参考：https://blog.csdn.net/m0_38086372/article/details/108440136
 */
class Heap {
    data = [];

    /**
     * 构造函数
     * @param {array} array 初始数组
     * @param {function} compare, 优先级比较函数，默认按数字/字母从小到大排序
     */
    constructor(array, compare) {
        if (typeof array === 'function') {
            compare = array;
            array = [];
        }

        if (compare) {
            if (typeof compare !== 'function') {
                throw '实例化类 Heap 时，若传入第二个参数，需要是优先级比较函数';
            } else {
                this.compare = compare;
            }
        }

        if (array) {
            if (!Array.isArray(array)) {
                throw '实例化类 Heap 时，第一个参数需要是数组';
            } else {
                array.forEach(ele => {
                    this.push(ele);
                });
            }
        }
    }

    /**
     * 元素入堆，比较该元素与其父节点的优先级，并作出调整
     * （父节点的优先级比左右子节点的优先级要高，所以只需要比较新增节点与其父节点的优先级并做调整）
     *
     * @param {any} ele 新加入的节点
     */
    push(ele) {
        this.data.push(ele);
        this._adjustUp(this.size - 1);
    }

    /**
     * 元素出堆，返回堆里优先级最高的节点，并将其从堆里删除
     *
     * 1. 获取堆顶节点（数组索引为 0）并保存
     * 2. 删除数组最后一个节点（数组索引为 data.length - 1），并将该节点覆盖栈顶节点（数组索引为 0）
     * 3. 调整栈顶节点的优先级
     *     - 只有左子节点：只和该节点比较判断是否交换
     *     - 左右子节点都有：选择左右节点之间优先级较高的进行比较
     * 4. 返回第 1 步保存的节点
     */
    pop() {
        if (this.size === 0) {
            return null;
        }

        // 堆栈节点与最后一个节点互换
        this._swap(0, this.size - 1);
        const result = this.data.pop();


        this._adjustDown(0);

        return result;
    }

    /**
     * 返回堆顶元素，但不删除
     */
    peek() {
        return this.data[0];
    }

    /**
     * 堆中节点数量
     */
    get size() {
        return this.data.length;
    }

    /**
     * 优先级比较函数，返回 true 表示第一个参数优先级更高
     */
    compare(a, b) {
        return  a < b;
    }

    /**
     * 向上调整优先级
     */
    _adjustUp(index) {
        let parentIndex = this._getParentIndex(index);
        while(index > 0 && this.compare(this.data[index], this.data[parentIndex])) {
            this._swap(index, parentIndex);
            index = parentIndex;
            parentIndex = this._getParentIndex(index);
        }
    }

    /**
     * 向下调整优先级
     */
    _adjustDown(index) {
        let len = this.size;

        while(this._getLeftChildIndex(index) < len) {
            let childIndex = this._getLeftChildIndex(index);
            let rightChildIndex = this._getRightChildIndex(index);

            // 若右子节点存在且优先级比左子节点更高，则选择右子节点进行比较
            if (rightChildIndex < len && this.compare(this.data[rightChildIndex], this.data[childIndex])) {
                childIndex = rightChildIndex;
            }

            // 若节点比其子节点优先级更高，则无需再调整了
            if (this.compare(this.data[index], this.data[childIndex])) {
                return;
            }

            this._swap(childIndex, index);
            index = childIndex;
        }
    }

    /**
     * 获取左子节点索引
     */
    _getLeftChildIndex(index) {
        return 2 * index + 1;
    }
    /**
     * 获取右子节点索引
     */
    _getRightChildIndex(index) {
        return 2 * index + 2;
    }
    /**
     * 获取父节点索引
     */
    _getParentIndex(index) {
        return Math.floor((index - 1)/2);
    }

    /**
     * 交互位置
     * @param {any} n
     * @param {any} m
     */
    _swap(n, m) {
        const temp = this.data[n];
        this.data[n] = this.data[m];
        this.data[m] = temp;
    }
}
