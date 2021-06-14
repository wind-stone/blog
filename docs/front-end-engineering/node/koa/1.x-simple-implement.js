class App {
    constructor() {
        this.fns = [];
    }
    use(genFn) {
        this.fns.push(genFn);
    }
    next(ctx, curGen) {
        if (!curGen) {
            const curFn = this.fns[ctx.index++];
            if (!curFn) {
                return;
            }
            curGen = curFn.apply(ctx, [this.next]);
        }
        let result;
        while ((result = curGen.next()) && !result.done) {
            if (result.value === this.next) {
                ctx.gens.push(curGen);
                this.next(ctx);
                curGen = ctx.gens.pop();
            } else if (isGenerator(result.value)) {
                ctx.gens.push(curGen);
                curGen = result.value.apply(ctx, [this.next]);
                this.next(ctx, curGen);
                curGen = ctx.gens.pop();
            }
        }
    }
    emitRequest() {
        const ctx = {
            index: 0,
            gens: []
        };
        this.next(ctx);
    }
}

function isGenerator(fn) {
    return fn.constructor.name === 'GeneratorFunction';
}

const app = new App();

app.use(function*(next) {
    console.log('1');
    yield next;
    console.log('6');
});

app.use(function*(next) {
    console.log('2');
    yield function*(next) {
        console.log('3');
        yield function*(next) {
            console.log('insert');
            yield next;
        };
    };
    // yield next
    console.log('5');
});

app.use(function*(next) {
    console.log('4');
    yield;
});

app.emitRequest();

// 返回结果
// 1
// 2
// 3
// insert
// 4
// 5
// 6
