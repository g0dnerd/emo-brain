export interface Track {
  name: string
  album: {
    images: [{ url: string }]
  }
  artists: [{ name: string }]
}

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
