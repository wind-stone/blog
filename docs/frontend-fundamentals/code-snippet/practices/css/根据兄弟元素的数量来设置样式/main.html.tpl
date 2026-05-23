<div>
    <!-- <vue-banner :banners="banners"></vue-banner> -->
    <div>
        <p class="doc-desc">3 个豆腐块 & 传入 keys</p>
        <vue-tofu :contents="data3" :keys="keys"></vue-tofu>
        <p class="doc-desc">4 个豆腐块 & 传入 maintitle</p>
        <vue-tofu :contents="data4" :titlecolor='{1: "#0066ff", 2: "#ffc600"}' maintitle="这里是主标题，位于豆腐块上方"></vue-tofu>
        <p class="doc-desc">5 个豆腐块</p>
        <vue-tofu :contents="data5" :titlecolor='{1: "#0066ff", 2: "#ffc600"}'></vue-tofu>
        <p class="doc-desc">6 个豆腐块</p>
        <vue-tofu :contents="data6" :titlecolor='{1: "#0066ff", 2: "#ffc600"}' ></vue-tofu>
        <p class="doc-desc">7 个豆腐块</p>
        <vue-tofu :contents="data7" :titlecolor='{1: "#0066ff", 2: "#ffc600"}'></vue-tofu>
        <p class="doc-desc">8 个豆腐块</p>
        <vue-tofu :contents="data8" :titlecolor='{1: "#0066ff", 2: "#ffc600"}'></vue-tofu>
    </div>
</div>