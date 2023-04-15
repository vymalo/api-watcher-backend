import { ApiRequestModel } from '../model/api-request.model';
import {
    AddApiRequestResponse,
    DeleteApiRequestResponse,
    GetAnApiRequestResponse,
    GetApiRequestsResponse,
    ApiApi,
} from '../gen/api/api/api/types';
import { Api } from '../gen/api/models';
import { SocketService } from './socket.service';

export class ApiApiImpl implements ApiApi {
    constructor(private readonly socketService: SocketService) {}

    public async addApiRequest(request: {
        [name: string]: Api.ApiRequestValue;
    }): Promise<AddApiRequestResponse> {
        const insertedGraph = await ApiRequestModel.transaction(async (trx) => {
            const saved = await ApiRequestModel.query(trx).insertGraph({
                request_body: JSON.stringify(request),
            });
            return saved;
        });

        this.socketService.send('new_api_request', this.map(insertedGraph));

        return {
            body: this.map(insertedGraph),
            status: 200,
        };
    }

    public async deleteApiRequest(
        apiRequestId: string
    ): Promise<DeleteApiRequestResponse> {
        const q = ApiRequestModel.query().findById(apiRequestId).delete();

        const r = await q;

        return {
            status: r === 1 ? 200 : 404,
        };
    }

    public async getAnApiRequest(
        apiRequestId: string
    ): Promise<GetAnApiRequestResponse> {
        const q = ApiRequestModel.query().findById(apiRequestId);

        const r = await q;

        if (!r)
            return {
                status: 404,
            };

        return {
            body: this.map(r),
            status: 200,
        };
    }

    public async getApiRequests(
        query: string | undefined,
        createdAt: string | undefined,
        page = 0,
        size = 4
    ): Promise<GetApiRequestsResponse> {
        const q = ApiRequestModel.query();

        if (query) {
            q.modify('searchByQuery', query);
        }
        if (createdAt) {
            q.where('created_at', '>=', createdAt);
        }

        q.orderBy('created_at', 'DESC');

        const data = await q.page(page, size);

        return {
            body: {
                content: data.results.map(this.map),
                meta: { total: data.total, size, page },
            },
            status: 200,
        };
    }

    private map({ id, created_at, request_body }: ApiRequestModel) {
        return {
            id,
            created_at,
            ...JSON.parse(request_body),
        };
    }
}
