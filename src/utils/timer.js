/**
 * 一秒钟后执行一次定时任务
 * @param {} func 
 */
export function transientTarget(func){
  setTimeout(
    () => {
      func()
    },1000
  )
}

/**
 * 每五秒执行定时任务
 * @param {} func 
 */
export function continuedTarget(func){
  setInterval(
    () => {
      func()
    },5000
  )
}

/**
 * 暂停只执行一次的定时任务
 * @param {*} target 
 */
export function stopTimeOutTask(target){
  clearTimeout(target)
}

/**
 * 暂停持续的定时任务
 * @param {*} target 
 */
export function stopIntervalTask(target){
  clearInterval(target)
}