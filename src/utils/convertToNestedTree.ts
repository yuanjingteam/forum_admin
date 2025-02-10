export function convertToNestedTree(data) {
  // 创建一个映射表，用于快速查找节点
  const map = {};
  const result = [];

  // 初始化映射表
  data.forEach(item => {
    map[item.id] = { ...item }; // 将每个节点存储在映射表中
  });

  // 遍历数据，构建父子关系
  data.forEach(item => {
    if (item.pid === 0) {
      // 如果 pid 为 0，则为根节点
      result.push(map[item.id]);
    } else {
      // 如果 pid 不为 0，则将其添加到父节点的 children 中
      if (map[item.pid]) {
        if (!map[item.pid].children) {
          map[item.pid].children = []; // 如果父节点没有 children 属性，则初始化为空数组
        }
        map[item.pid].children.push(map[item.id]);
      } else {
        console.warn(
          `Warning: Parent node with id ${item.pid} not found for item ${item.id}`
        );
      }
    }
  });

  return result;
}
