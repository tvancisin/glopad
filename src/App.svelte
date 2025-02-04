<script>
  import { Router, Route } from "svelte5-router";
  import SubPage from "./routes/SubPage.svelte";
  import Home from "./routes/Home.svelte";
</script>

<Router>
  <Route basePath="/glopad/" component={Home} />
  <Route path="/glopad/:dynamicPath" component={SubPage} />
</Router>