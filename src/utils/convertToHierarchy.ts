export function convertToHierarchy(data) {
  // 创建一个映射表，用于快速查找节点
  const map = {};
  const result = [];

  // 初始化映射表，并标记根节点
  data.forEach(item => {
    map[item.id] = { ...item, children: [] }; // 为每个节点添加 children 属性
  });

  // 遍历数据，构建父子关系
  data.forEach(item => {
    if (item.pid === 0) {
      // 如果 pid 为 0，则为根节点
      result.push(map[item.id]);
    } else {
      // 如果 pid 不为 0，则将其添加到父节点的 children 中
      if (map[item.pid]) {
        map[item.pid].children.push(map[item.id]);
      } else {
        console.warn(
          `Warning: Parent node with id ${item.pid} not found for item ${item.id}`
        );
      }
    }
  });

  // 清理空的 children 属性
  function cleanEmptyChildren(nodes) {
    nodes.forEach(node => {
      if (node.children.length === 0) {
        delete node.children; // 如果 children 为空数组，则移除该属性
      } else {
        cleanEmptyChildren(node.children); // 递归清理子节点
      }
    });
  }

  cleanEmptyChildren(result);

  // 可选：对结果进行排序
  function sortTree(nodes) {
    nodes.sort((a, b) => a.sort - b.sort);
    nodes.forEach(node => {
      if (node.children && node.children.length > 0) {
        sortTree(node.children);
      }
    });
  }

  sortTree(result);

  return result;
}
