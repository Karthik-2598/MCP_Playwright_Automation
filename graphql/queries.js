// All GraphQL documents live here so tests stay readable and queries are reused.

const POSTS_QUERY = `
  query Posts(
    $first: Int
    $after: String
    $postedAfter: DateTime
    $topic: String
    $order: PostsOrder
  ) {
    posts(
      first: $first
      after: $after
      postedAfter: $postedAfter
      topic: $topic
      order: $order
    ) {
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        cursor
        node {
          id
          name
          votesCount
          createdAt
        }
      }
    }
  }
`;

const VIEWER_ID_QUERY = `
  query ViewerId {
    viewer {
      user {
        id
      }
    }
  }
`;

module.exports = { POSTS_QUERY, VIEWER_ID_QUERY };
