import url from 'url'
import assert from 'assert'
import axios from 'axios'

const GITHUB_API = 'https://api.github.com'

interface Issue {
  url: string
  number: number
  title: string
}

function makeMDListItem(issue: Issue) {
  const { title, url } = issue
  return `* [${title}](${url})`
}

interface IConfig {
  link: string
  accessToken?: string
}

export default async function generate({ link, accessToken }: IConfig) {
  // assert(accessToken, 'should provide accessToken')
  const path = url.parse(link).path

  assert(path, 'Link should has path')
  if (!path) return
  const paths = path.split('/').filter(Boolean)
  assert(paths.length === 2, 'Link should has path')
  const [owner, repo] = paths
  const api = `${GITHUB_API}/repos/${owner}/${repo}/issues`
  const response = await axios.get<Issue[]>(api)
  return response.data.map(issue => makeMDListItem(issue)).join('\n')
}
