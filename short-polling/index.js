const http = require('http');


let jobs = {};


setInterval(() => {
  for (const jobId in jobs) {
    if (jobs[jobId] < 100) {
      jobs[jobId] += 1;
    }
  }
}, 1000);


const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (pathname === '/create-job') {

    const jobId = Math.random().toString(36).substring(2, 15);
    jobs[jobId] = 0; 

    console.log(`Job created: ${jobId}`);
    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ jobId, progress: jobs[jobId] }));

  } else if (pathname === '/job-updates') {
 
    const jobId = url.searchParams.get('jobId');
    if (!jobId || !(jobId in jobs)) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Job not found' }));
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    });


    const intervalId = setInterval(() => {
      res.write(`data: ${JSON.stringify({ jobId, progress: jobs[jobId] })}\n\n`);

      if (jobs[jobId] >= 100) {
        clearInterval(intervalId);
        res.write(`data: ${JSON.stringify({ jobId, progress: jobs[jobId], status: 'completed' })}\n\n`);
        res.end();
      }
    }, 10000);


    req.on('close', () => {
      clearInterval(intervalId);
      console.log(`Connection closed for job: ${jobId}`);
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Endpoint not found\n');
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
