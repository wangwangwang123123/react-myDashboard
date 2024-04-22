import { GraphQLClient } from "@refinedev/nestjs-query";
import { GraphQLFormattedError } from "graphql";

type Error  = {
	message :string;
	statusCode: string
}



//自己的fetch 函数 像是一个中间件
const customFetch = async(url: string, options: RequestInit) =>{
	const accessToken = localStorage.getItem('access_token');

	const headers = options.headers as Record<string, string>;

	return await fetch (url,{
		...options,
		headers:{
			...headers,
			Authorization: headers?.Authorization  || `Bearer ${accessToken}`, "Content-Type" : "application/json",
			"Apollo-Require-Preflight" : "ture",
		}
	})
}


const getGraphQLErrors = (body: Record<"errors", GraphQLFormattedError[] | undefined >):
Error | null =>{
	if (! body){
		return {
			message: 'Unknown error',
			statusCode: "Internal_SERVER_ERROR"
		}
	}

	if("errors" in body){

		const errors = body?.errors
		const message = errors?.map((error) => error?.message)?.join("");
		const code  = errors?.[0]?.extensions?.code;

		return{
			message: message || JSON.stringify(errors),
			statusCode : code || 500
		}

	}

	return null;
}


//打包了fetch  导出
export const fetchWrapper = async (url: string, options: RequestInit) => {
	const response = await customFetch(url, options);
	const responseClone = response.clone();


	const body = await responseClone.json();

	const error = getGraphQLErrors(body);
	if (error){
		throw error;
	}
	return response
}