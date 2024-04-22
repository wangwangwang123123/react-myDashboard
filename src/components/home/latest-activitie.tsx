import { UnorderedListOutlined } from '@ant-design/icons'
import { Card, List, Space } from 'antd'
import React from 'react'
import { Text } from '../text'
import { LatestActivitesSkeleton } from '..'
import gql from 'graphql-tag'
import { DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY, DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY } from '@/graphql/queries'
import { useList } from '@refinedev/core'
import dayjs from 'dayjs'
import CustomAvatar from '../custom-avator'

const LatestActivities = () => {
	// map 出数据
	const { data: audit, isLoading: isLoadingAudit, isError, error } = useList({
		resource: 'audits',
		meta:{
			gqlQuery: DASHBOARD_LATEST_ACTIVITIES_AUDITS_QUERY
		}
	})
	const dealIds = audit?.data?.map((audit) => audit?.targetId)

	//用map出来的数据 fetch deals
	const {data: deals, isLoading : isLoadingDeals} = useList({
		resource: 'deals',
		queryOptions: {
			enabled:  !!dealIds?.length


		},
		pagination: {
			mode: 'off'
		},
		filters: [{
			field: 'id',
			operator: 'in',
			value: dealIds
		}],
		meta:{
			gqlQuery: DASHBOARD_LATEST_ACTIVITIES_DEALS_QUERY
		}
	})
	

	

	if(isError){
		console.log(error)
		return null
	}
	const isLoading = isLoadingAudit || isLoadingDeals
	
	return (
		<Card
			style={{ padding: '16px' }}
			title={(
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						gap: '8px',
					}}

				>
					<UnorderedListOutlined />
					<Text
						size='sm'
						style={{
							marginLeft: '0.5rem',

						}}
					>
						Latest Activites
					</Text>
				</div>

			)}
		>
			{isLoading ? (
				<List
					itemLayout='horizontal'
					dataSource={Array.from({ length: 5 }).map((_, index) => ({
						id: index,

					}))}
					renderItem={(_,index) => (
						<LatestActivitesSkeleton key={index}/>
					)}
				/>

			) :

				(<List 
					itemLayout='horizontal'
					dataSource={audit?.data}
					renderItem={(item) =>{
						const deal = deals?.data?.find((deal) => deal.id === String(item.targetId)) || undefined
						return (
							<List.Item>
								<List.Item.Meta
									title={dayjs(deal?.createdAt).format('MMM DD, YYYY - HH: mm: ss')}
									avatar = {
										<CustomAvatar
											shape='square'
											size={48}
											src={deal?.company.avatarUrl}
											name={deal?.company.name}
										/>
									}
									description  ={
										<Space
											size={4}
										>
											<Text
												strong
											>

												{item.user?.name}
											</Text>
											<Text>
												{item.action ===
												'CRACTE' ? 'Created' : 'Updated'
												}
											</Text>
											<Text strong>
												{deal?.title}
											</Text>
											<Text>
												deal
											</Text>
											<Text>
												{item.action ===
												'CRACTE' ? 'in' : 'to'
												}
											</Text>
											<Text strong>
												{deal?.stage?.title}
											</Text>

										</Space>
									}
								
								>
									
								</List.Item.Meta>
							</List.Item>
						)
					}}
				/>)}
		</Card>
	)
}

export default LatestActivities