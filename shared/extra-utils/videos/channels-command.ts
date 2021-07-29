import { pick } from '@shared/core-utils'
import { HttpStatusCode, ResultList, VideoChannel, VideoChannelCreateResult } from '@shared/models'
import { VideoChannelCreate } from '../../models/videos/channel/video-channel-create.model'
import { VideoChannelUpdate } from '../../models/videos/channel/video-channel-update.model'
import { unwrapBody } from '../requests'
import { AbstractCommand, OverrideCommandOptions } from '../shared'

export class ChannelsCommand extends AbstractCommand {

  list (options: OverrideCommandOptions & {
    start?: number
    count?: number
    sort?: string
    withStats?: boolean
  } = {}) {
    const path = '/api/v1/video-channels'

    return this.getRequestBody<ResultList<VideoChannel>>({
      ...options,

      path,
      query: pick(options, [ 'start', 'count', 'sort', 'withStats' ]),
      implicitToken: false,
      defaultExpectedStatus: HttpStatusCode.OK_200
    })
  }

  listByAccount (options: OverrideCommandOptions & {
    accountName: string
    start?: number
    count?: number
    sort?: string
    withStats?: boolean
    search?: string
  }) {
    const { accountName, sort = 'createdAt' } = options
    const path = '/api/v1/accounts/' + accountName + '/video-channels'

    return this.getRequestBody<ResultList<VideoChannel>>({
      ...options,

      path,
      query: { sort, ...pick(options, [ 'start', 'count', 'withStats', 'search' ]) },
      implicitToken: false,
      defaultExpectedStatus: HttpStatusCode.OK_200
    })
  }

  async create (options: OverrideCommandOptions & {
    attributes: VideoChannelCreate
  }) {
    const path = '/api/v1/video-channels/'

    // Default attributes
    const defaultAttributes = {
      displayName: 'my super video channel',
      description: 'my super channel description',
      support: 'my super channel support'
    }
    const attributes = { ...defaultAttributes, ...options.attributes }

    const body = await unwrapBody<{ videoChannel: VideoChannelCreateResult }>(this.postBodyRequest({
      ...options,

      path,
      fields: attributes,
      implicitToken: true,
      defaultExpectedStatus: HttpStatusCode.OK_200
    }))

    return body.videoChannel
  }

  update (options: OverrideCommandOptions & {
    channelName: string
    attributes: VideoChannelUpdate
  }) {
    const { channelName, attributes } = options
    const path = '/api/v1/video-channels/' + channelName

    return this.putBodyRequest({
      ...options,

      path,
      fields: attributes,
      implicitToken: true,
      defaultExpectedStatus: HttpStatusCode.NO_CONTENT_204
    })
  }

  delete (options: OverrideCommandOptions & {
    channelName: string
  }) {
    const path = '/api/v1/video-channels/' + options.channelName

    return this.deleteRequest({
      ...options,

      path,
      implicitToken: true,
      defaultExpectedStatus: HttpStatusCode.NO_CONTENT_204
    })
  }

  get (options: OverrideCommandOptions & {
    channelName: string
  }) {
    const path = '/api/v1/video-channels/' + options.channelName

    return this.getRequestBody<VideoChannel>({
      ...options,

      path,
      implicitToken: false,
      defaultExpectedStatus: HttpStatusCode.OK_200
    })
  }

  updateImage (options: OverrideCommandOptions & {
    fixture: string
    channelName: string | number
    type: 'avatar' | 'banner'
  }) {
    const { channelName, fixture, type } = options

    const path = `/api/v1/video-channels/${channelName}/${type}/pick`

    return this.updateImageRequest({
      ...options,

      path,
      fixture,
      fieldname: type + 'file',

      implicitToken: true,
      defaultExpectedStatus: HttpStatusCode.OK_200
    })
  }

  deleteImage (options: OverrideCommandOptions & {
    channelName: string | number
    type: 'avatar' | 'banner'
  }) {
    const { channelName, type } = options

    const path = `/api/v1/video-channels/${channelName}/${type}`

    return this.deleteRequest({
      ...options,

      path,
      implicitToken: true,
      defaultExpectedStatus: HttpStatusCode.NO_CONTENT_204
    })
  }
}
