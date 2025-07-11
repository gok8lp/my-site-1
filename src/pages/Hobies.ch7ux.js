// Velo API Referansı: https://www.wix.com/velo/reference/api-overview/introduction

$w.onReady(function () {
import {fetch} from 'wix-fetch';

const USERNAME = "gok8lp";  // AniList kullanıcı adın

const query = `
query {
  MediaListCollection(userName: "${USERNAME}", type: ANIME, status: CURRENT) {
    lists {
      entries {
        media {
          title {
            romaji
            english
          }
          episodes
          coverImage {
            medium
          }
        }
        progress
        score
      }
    }
  }
}
`;

$w.onReady(async () => {
  try {
    const response = await fetch('https://graphql.anilist.co', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const { data } = await response.json();

    const list = data.MediaListCollection.lists[0]?.entries.map(item => ({
      title: item.media.title.romaji || item.media.title.english,
      image: item.media.coverImage.medium,
      progress: item.progress,
      total: item.media.episodes || '?',
      score: item.score || '-'
    })) || [];

    bindRepeater('#repeater1', list);

  } catch (err) {
    console.error('AniList API error:', err);
  }
});

function bindRepeater(repId, dataList) {
  $w(repId).data = dataList;
  $w(repId).onItemReady(($item, itemData) => {
    $item('#image1').src = itemData.image;
    $item('#text2').text = itemData.title;
    $item('#text3').text = `Progress: ${itemData.progress}/${itemData.total}`;
    $item('#text4').text = `Score: ${itemData.score}`;
  });
}

});