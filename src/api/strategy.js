import httpRequest from '@/utils/request'

export async function getAllStrategy(){
    return await httpRequest.get('/strategy', null)
}

export async function getStrategyById(strategyId){
    return await httpRequest.get(`/strategy/${strategyId}`, null)
}

export async function getAllOpenStrategy(){
    return await httpRequest.get('/strategy/open', null)
}

export async function getAllCloseStrategy(){
    return await httpRequest.get('/strategy/close', null)
}

