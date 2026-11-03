
const currentUrl = window.location.href;
const siteUrl = "https://cyeonjun.github.io";
let updatedUrl = currentUrl.replace("https://cyeonjun.github.io", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("".length > 0) {
  updatedUrl = updatedUrl.replace("/", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "About",
    section: "Navigation menu",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "Publications",
          description: "Peer-reviewed publications in reverse chronological order.",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-projects",
          title: "Projects",
          description: "Research and engineering projects.",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Curriculum vitae of Yeonjun Choi.",
          section: "Navigation menu",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "Posts",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "Posts",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "news-joined-andlab-at-yonsei-university-as-a-graduate-researcher",
          title: 'Joined ANDLab at Yonsei University as a Graduate Researcher.',
          description: "",
          section: "News",},{id: "news-our-paper-as-eastern-powers-i-will-veto-an-investigation-of-nation-level-bias-of-large-language-models-in-international-relations-was-published-at-aaai-2026",
          title: 'Our paper “As Eastern Powers, I Will Veto.”: An Investigation of Nation-Level Bias...',
          description: "",
          section: "News",},{id: "news-our-paper-tool-mad-a-multi-agent-debate-framework-for-fact-verification-with-diverse-tool-augmentation-and-adaptive-retrieval-was-published-in-ieee-access",
          title: 'Our paper Tool-MAD: A Multi-Agent Debate Framework for Fact Verification with Diverse Tool...',
          description: "",
          section: "News",},{id: "news-our-paper-multi-test-nation-bias-benchmarking-of-llms-with-explicit-unbiased-baselines-was-published-in-tacl",
          title: 'Our paper Multi-Test Nation Bias Benchmarking of LLMs with Explicit Unbiased Baselines was...',
          description: "",
          section: "News",},{id: "news-our-paper-duquad-a-dual-view-framework-with-quality-aware-evidence-pruning-for-multi-document-question-answering-was-published-at-emnlp-2026-first-author",
          title: 'Our paper DuQUAD: A Dual-View Framework with Quality-Aware Evidence Pruning for Multi-Document Question...',
          description: "",
          section: "News",},{id: "projects-warframe",
          title: 'WarFrame',
          description: "Counterfactual benchmark for geopolitical narrative framing bias in LLMs",
          section: "Projects",handler: () => {
              window.location.href = "/projects/1_warframe/";
            },},{id: "projects-railway-control-system-db-migration",
          title: 'Railway Control System DB Migration',
          description: "TiDB vs. TiDB + ClickHouse benchmarking with Hyundai Rotem",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_railway_db/";
            },},{id: "projects-hci-study-on-llm-bias-standards",
          title: 'HCI Study on LLM Bias Standards',
          description: "How users perceive “reality-reflecting” vs. “norm-correcting” LLMs",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_hci_bias_standards/";
            },},{
        id: 'social-email',
        title: 'Send an email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%63%68%6C%64%75%73%77%6E%73%39%39@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/CYeonJun", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/yeonjunchoi", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=7YVTKtAAAAAJ", "_blank");
        },
      },{
          id: 'lang-ko-kr',
          title: 'ko-kr',
          section: 'Languages',
          handler: () => {
            window.location.href = "/ko-kr" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
