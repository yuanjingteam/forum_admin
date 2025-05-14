export function convertToHierarchy(arr) {
  const map = new Map(); // 使用 Map 存储每个对象，以便通过父ID快速查找
  const result = [];

  // 将每个对象存储到 Map 中
  arr.forEach(item => {
    //判断是否找到有孩子的对象
    let flag = false;
    arr.forEach(element => {
      if (item.id === element.pid) {
        //找到有孩子的对象
        flag = true;
      }
      if (flag) {
        //初始化有孩子的层级
        map.set(item.id, { ...item, children: [] });
        //找到一个就返回
        return;
      }
    });
    //遍历完发现没有找到
    if (!flag) {
      //将每个对象的id作为键，剩余内容作为值存储
      map.set(item.id, { ...item });
    }
  });

  // 构建层级结构
  map.forEach(item => {
    //item为map的值
    if (item.pid === 0) {
      result.push(item); // 如果父ID为0，则为顶级对象
      // console.log(result);
    } else {
      //根据父亲id获取父亲对象的值
      const parent = map.get(item.pid);
      // console.log(parent);
      //如果对象存在
      if (parent) {
        parent.children.push(item); // 将子对象添加到父对象的children数组中
        // console.log(result);
      }
    }
  });

  return result;
}
