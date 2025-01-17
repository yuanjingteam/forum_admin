// 定义一个类型，用于指定链接打开的目标上下文
type TargetContext = '_self' | '_parent' | '_blank' | '_top';

// 打开一个新窗口的函数，接受 URL 和可选的选项
export const openWindow = (
  url: string, // 要打开的 URL
  opts?: { target?: TargetContext; [key: string]: any } // 可选的选项，包含目标和其他任意属性
) => {
  // 解构 opts，设置默认目标为 '_blank'
  const { target = '_blank', ...others } = opts || {};

  // 使用 window.open 方法打开新窗口
  window.open(
    url, // 要打开的 URL
    target, // 打开的目标上下文
    // 将其他选项转换为字符串形式的窗口特性
    Object.entries(others)
      .reduce((preValue: string[], curValue) => {
        const [key, value] = curValue; // 解构当前键值对
        return [...preValue, `${key}=${value}`]; // 生成特性字符串
      }, [])
      .join(',') // 将特性数组连接为字符串
  );
};

// 定义一个正则表达式用于验证 URL 的格式
export const regexUrl = new RegExp(
  // 正则表达式内容
  '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
  'i' // 忽略大小写
);

// 默认导出 null，通常用于占位或避免导出其他内容
export default null;
