fetch("data/notifications.json")
  .then(res => res.json())
  .then(data => {
    data.forEach(n =>
      console.log(`[${n.channel}] ${n.message}`)
    );
  });
