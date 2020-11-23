<template>
    <div class="comment-count">
        <div class="count">
            <span id="busuanzi_container_site_pv">
                &nbsp;&nbsp;本站总访问量<span id="busuanzi_value_site_pv" />&nbsp;&nbsp;次
            </span>
        </div>
        <div class="gitalk-container">
            <div id="gitalk-container" />
        </div>
        <script
            async
            src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"
        />
    </div>
</template>
<script>
import Gitalk from 'gitalk';
import 'gitalk/dist/gitalk.css';

export default {
    name: 'Comment',
    data() {
        return {};
    },
    mounted() {
        const commentConfig = {
            clientID: '4c157770ee33d9d0779d',
            clientSecret: '14cca8b8e3183cb40972871e85a4d1dcd68c5d63',
            repo: 'blog',
            owner: 'wind-stone',
            // 这里接受一个数组，可以添加多个管理员
            admin: ['wind-stone'],
            // id 用于当前页面的唯一标识，一般来讲 pathname 足够了，

            // 但是如果你的 pathname 超过 50 个字符，GitHub 将不会成功创建 issue，此情况可以考虑给每个页面生成 hash 值的方法.
            id: location.pathname,
            distractionFreeMode: false,
        };
        // eslint-disable-next-line no-undef
        const gitalk = new Gitalk(commentConfig);
        gitalk.render('gitalk-container');
    },
};
</script>

<style lang="less" scoped>
.count {
    margin-top: 50px;
    text-align: center;
}
</style>
