import httpRequest from '@/utils/request'

//获取策略名
export async function getAllStrategy(uid=10){
    return await httpRequest.get('', {qtype:"get_user_trading_instance", uid:uid})
}

//查看策略参数
export async function getStrategyParam(strategyName){
    return await httpRequest.get('', {qtype:"search_stg_param_template", strategy_name:strategyName})
}

//获取用户交易实例
export async function getTradingInstance(uid=10){
  return await httpRequest.get('', {qtype:"get_user_trading_instance", uid:uid})
}

//获取用户交易记录
export async function getTradingRecords(uid){
  return await httpRequest.get('', {qtype:"get_user_trading_records", uid:uid})
}



