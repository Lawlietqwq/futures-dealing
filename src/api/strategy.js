import request from '@/utils/request'

export function getAllStrategy(){
    return request({
        url:'/strategy',
        method:'get',
    })
}

export function getStrategyById(strategyId){
    return request({
        url:`/strategy/${strategyId}`,
        method:'get',
    })
}


