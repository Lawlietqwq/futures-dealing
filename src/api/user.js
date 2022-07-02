import httpRequest from '@/utils/request'
import store from '@/store'

export async function login(data){
    return await httpRequest({
        url:'',
        method:'post',
        data
    })
}

export async function logout(data){
    return await httpRequest({
        url:'',
        method:'post',
        data
    })
}

export async function register(data){
    return await httpRequest({
        url:'',
        method:'post',
        data
    })
}

export async function getUserInfo(data){
    return await httpRequest({
        url:'',
        method:'get',
        data
    })
}

