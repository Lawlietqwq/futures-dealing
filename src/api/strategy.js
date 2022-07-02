import httpRequest from '@/utils/request'

export async function getAllStrategy(){
    return await httpRequest.get('/strategy', null)
}


export async function getStrategyById(strategyId){
    return await httpRequest.get(`/strategy/${strategyId}`, null)
}


