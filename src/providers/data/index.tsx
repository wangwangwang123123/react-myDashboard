import graphqlDataProvider, {GraphQLClient, liveProvider as graphqlLiveProvider  } from "@refinedev/nestjs-query"
import { fetchWrapper } from "./fetch-wrapper";
import { createClient } from "graphql-ws";


export const API_BASE_URL = "https://api.crm.refine.dev";
export const API_URL = `${API_BASE_URL}/graphql`;
export const WS_URL = "wss://api.crm.refine.dev/graphql";

export const client = new GraphQLClient (API_URL,{
	fetch: (url:string, options: RequestInit) =>{
		try {
			return fetchWrapper(url, options);
		} catch (error) {
			return Promise.reject(error as Error)
		}
	}
})

export const wsClient = typeof window !== "undefined" 
? createClient({
	url: WS_URL,
	connectionParams: () =>{
	const accessToken = localStorage.getItem("access_token");

		return {
			headers:{
				Authorization: `Bearer ${accessToken}`,
			}
		}
 	}
}):undefined


export const dataProvider = graphqlDataProvider(client);
export const liveProvider = wsClient ?  graphqlLiveProvider(wsClient) : undefined;


//refine 有一个live provider, 允许应用程序实时更新,用户添加了什么其他人可以立刻看到它,无需刷新
//所以我们需要实时监听变化