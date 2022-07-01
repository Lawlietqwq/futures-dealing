import request from '@/utils/request'

export function getAllModel(){
    return request({
        url:'/model',
        method:'get',
    })
}


export function getModelById(modelId){
    return request({
        url:`/model/${modelId}`,
        method:'get',
    })
}


export function createModel(data){
    return request({
        url:'/model',
        method:'post',
        data
    })
}


export function updateModel(data){
    const modelId = data.modelId
    return request({
        url:`/model/${modelId}`,
        method:'put',
        data
    })
}


export function deleteModel(modelId){
    return request({
        url:`/model/${modelId}`,
        method:'delete',
    })
}