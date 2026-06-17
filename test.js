/**
 * @param {number[]} nums
 * @return {number}
 */

var robRange = function (nums) {
    if (!nums || !nums.length) {
        return 0;
    }

    const len = nums.length;
    if (len === 1) {
        return nums[0];
    }

    const dp = [];

    let first = nums[0];
    let second = Math.max(nums[0], nums[1]);

    for (let i = 2; i < len; i++) {
        const res = Math.max(second, first + nums[i]);
        first = second;
        second = res;
    }

    return second;
};

var rob = function (nums) {
    if (!nums || !nums.length) {
        return 0;
    }

    const len = nums.length;
    if (len === 1) {
        return nums[0];
    } else if (len === 2) {
        return Math.max(nums[0], nums[1]);
    }
    return Math.max(robRange(nums.slice(0, nums.length - 2)), robRange(nums.slice(1)));
};
