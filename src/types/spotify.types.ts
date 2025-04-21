// https://developer.spotify.com/documentation/web-api/reference/get-a-list-of-current-users-playlists

export interface PlaylistResponse {
  href: string
  limit: number
  next: string | null
  offset: number
  previous: string | null
  total: number
  items: SimplifiedPlaylist[]
}

export interface SimplifiedPlaylist {
  collaborative: boolean
  description: string
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  images: Image[]
  name: string
  owner: User
  public: boolean
  snapshot_id: string
  tracks: {
    href: string
    total: number
  }
  type: 'playlist'
  uri: string
}

export interface Image {
  url: string
  height: number | null
  width: number | null
}

export interface User {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  type: string
  uri: string
  display_name: string | null
}

export interface Device {
  id: string | null
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number | null
  supports_volume: boolean
}

export interface WebPlaybackState {
  context: {
    uri: string | null
    metadata: any
  }
  disallows: {
    pausing: boolean
    peeking_next: boolean
    peeking_prev: boolean
    resuming: boolean
    seeking: boolean
    skipping_next: boolean
    skipping_prev: boolean
  }
  paused: boolean
  position: number
  repeat_mode: number
  shuffle: number
  track_window: {
    current_track: WebPlaybackTrack
    previous_tracks: WebPlaybackTrack[]
    next_tracks: WebPlaybackTrack[]
  }
}

export interface WebPlaybackTrack {
  uri: string
  id: string | null
  type: string
  media_type: string
  name: string
  is_playable: boolean
  album: {
    uri: string
    name: string
    images: [{ url: string }]
  }
  artists: [{ uri: string; name: string }]
}
