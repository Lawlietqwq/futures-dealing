import httpRequest from '@/utils/request'

//获取策略名
export async function getStrategyName(uid=10){
    return await httpRequest.get('', {qtype:"search_strategy_template", uid:uid})
}

//查看策略参数
export async function getStrategyParam(strategyName){
    return await httpRequest.get('', {qtype:"search_strategy_param_template", strategy_sname:strategyName})
}

//获取用户交易实例
export async function getTradingInstance(uid=10){
  return await httpRequest.get('', {qtype:"get_user_trading_instance", uid:uid})
}

//获取用户交易记录
export async function getTradingRecords(uid){
  return await httpRequest.get('', {qtype:"get_user_trading_records", uid:uid})
}

//创建策略实例
export async function createModel(params){
  return await httpRequest.get('', {qtype:"create_strategy_instance", ...params})
}

//启动一个策略实例
export async function startModel(strategy_id){
  return await httpRequest.get('', {qtype:"start_strategy_instance", strategy_id:strategy_id})
}

//查询合约列表
export async function getCodeList(){
  return await httpRequest.get('', {qtype:"get_all_code"})
}
