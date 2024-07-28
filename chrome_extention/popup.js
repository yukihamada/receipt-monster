let feedCount = 0;

document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get(['dailyFeedCount', 'lastFeedDate'], function(result) {
    const today = new Date().toDateString();
    if (result.lastFeedDate === today) {
      feedCount = result.dailyFeedCount || 0;
    } else {
      chrome.storage.local.set({dailyFeedCount: 0, lastFeedDate: today});
    }
    updateFeedCount();
  });
});

document.getElementById('feedButton').addEventListener('click', function() {
  const monster = document.getElementById('monster');
  const status = document.getElementById('status');
  
  status.textContent = "モンスターが食事中...";
  monster.src = "monster_eating.png";
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "feedMonster"}, function(response) {
      if (response && response.success) {
        status.textContent = "モンスターは満足そうです！";
        monster.src = "monster_happy.png";
        feedCount++;
        updateFeedCount();
        saveFeedCount();
      } else {
        status.textContent = "モンスターは食べられませんでした：" + (response ? response.error : "不明なエラー");
        monster.src = "monster_sad.png";
      }
      
      setTimeout(() => {
        monster.src = "monster_normal.png";
        status.textContent = "";
      }, 3000);
    });
  });
});

function updateFeedCount() {
  document.getElementById('count').textContent = feedCount;
}

function saveFeedCount() {
  chrome.storage.local.set({
    dailyFeedCount: feedCount,
    lastFeedDate: new Date().toDateString()
  });
}