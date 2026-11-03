
const currentUrl = window.location.href;
const siteUrl = "https://cyeonjun.github.io";
let updatedUrl = currentUrl.replace("https://cyeonjun.github.io", "");
if (currentUrl.length == updatedUrl.length && currentUrl.startsWith("http://127.0.0.1")) {
  const otherSiteUrl = siteUrl.replace("localhost", "127.0.0.1");
  updatedUrl = currentUrl.replace(otherSiteUrl + "", "");
}
if ("ko-kr".length > 0) {
  updatedUrl = updatedUrl.replace("/ko-kr", "");
}
// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-소개",
    title: "소개",
    section: "메뉴",
    handler: () => {
      window.location.href = "/ko-kr/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "Peer-reviewed publications in reverse chronological order.",
          section: "메뉴",
          handler: () => {
            window.location.href = "/ko-kr/publications/";
          },
        },{id: "nav-프로젝트",
          title: "프로젝트",
          description: "연구 및 엔지니어링 프로젝트",
          section: "메뉴",
          handler: () => {
            window.location.href = "/ko-kr/projects/";
          },
        },{id: "nav-이력",
          title: "이력",
          description: "최연준 이력서",
          section: "메뉴",
          handler: () => {
            window.location.href = "/ko-kr/cv/";
          },
        },{id: "post-google-gemini-updates-flash-1-5-gemma-2-and-project-astra",
        
          title: 'Google Gemini updates: Flash 1.5, Gemma 2 and Project Astra <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "We’re sharing updates across our Gemini family of models and a glimpse of Project Astra, our vision for the future of AI assistants.",
        section: "글",
        handler: () => {
          
            window.open("https://blog.google/technology/ai/google-gemini-update-flash-ai-assistant-io-2024/", "_blank");
          
        },
      },{id: "post-displaying-external-posts-on-your-al-folio-blog",
        
          title: 'Displaying External Posts on Your al-folio Blog <svg width="1.2rem" height="1.2rem" top=".5rem" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M17 13.5v6H5v-12h6m3-3h6v6m0-6-9 9" class="icon_svg-stroke" stroke="#999" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
        
        description: "",
        section: "글",
        handler: () => {
          
            window.open("https://medium.com/@al-folio/displaying-external-posts-on-your-al-folio-blog-b60a1d241a0a?source=rss-17feae71c3c4------2", "_blank");
          
        },
      },{id: "news-연세대학교-andlab에-대학원-연구원으로-합류했습니다",
          title: '연세대학교 ANDLab에 대학원 연구원으로 합류했습니다.',
          description: "",
          section: "소식",},{id: "news-논문-as-eastern-powers-i-will-veto-an-investigation-of-nation-level-bias-of-large-language-models-in-international-relations이-aaai-2026에-게재되었습니다",
          title: '논문 “As Eastern Powers, I Will Veto.”: An Investigation of Nation-Level Bias of...',
          description: "",
          section: "소식",},{id: "news-논문-tool-mad-a-multi-agent-debate-framework-for-fact-verification-with-diverse-tool-augmentation-and-adaptive-retrieval이-ieee-access에-게재되었습니다",
          title: '논문 Tool-MAD: A Multi-Agent Debate Framework for Fact Verification with Diverse Tool Augmentation...',
          description: "",
          section: "소식",},{id: "news-논문-multi-test-nation-bias-benchmarking-of-llms-with-explicit-unbiased-baselines이-tacl에-게재되었습니다",
          title: '논문 Multi-Test Nation Bias Benchmarking of LLMs with Explicit Unbiased Baselines이 TACL에 게재되었습니다....',
          description: "",
          section: "소식",},{id: "news-1저자-논문-duquad-a-dual-view-framework-with-quality-aware-evidence-pruning-for-multi-document-question-answering이-emnlp-2026에-게재되었습니다",
          title: '1저자 논문 DuQUAD: A Dual-View Framework with Quality-Aware Evidence Pruning for Multi-Document Question...',
          description: "",
          section: "소식",},{id: "projects-warframe",
          title: 'WarFrame',
          description: "LLM의 지정학적 서사 프레이밍 편향을 측정하는 반사실적 벤치마크",
          section: "프로젝트",handler: () => {
              window.location.href = "/ko-kr/projects/1_warframe/";
            },},{id: "projects-철도-관제-시스템-db-마이그레이션",
          title: '철도 관제 시스템 DB 마이그레이션',
          description: "현대로템 산학협력 — TiDB vs. TiDB + ClickHouse 성능 비교",
          section: "프로젝트",handler: () => {
              window.location.href = "/ko-kr/projects/2_railway_db/";
            },},{id: "projects-llm-편향-기준에-대한-hci-연구",
          title: 'LLM 편향 기준에 대한 HCI 연구',
          description: "“현실 반영형” vs. “규범 교정형” LLM에 대한 사용자 인식",
          section: "프로젝트",handler: () => {
              window.location.href = "/ko-kr/projects/3_hci_bias_standards/";
            },},{
        id: 'social-email',
        title: '이메일 보내기',
        section: '소셜',
        handler: () => {
          window.open("mailto:%63%68%6C%64%75%73%77%6E%73%39%39@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: '소셜',
        handler: () => {
          window.open("https://github.com/CYeonJun", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: '소셜',
        handler: () => {
          window.open("https://www.linkedin.com/in/yeonjunchoi", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: '소셜',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=7YVTKtAAAAAJ", "_blank");
        },
      },{
          id: 'lang-en-us',
          title: 'en-us',
          section: '언어',
          handler: () => {
            window.location.href = "" + updatedUrl;
          },
        },{
      id: 'light-theme',
      title: '라이트 테마',
      description: '라이트 테마로 변경',
      section: '테마',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: '다크 테마',
      description: '다크 테마로 변경',
      section: '테마',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: '시스템 테마',
      description: '시스템 기본 테마 사용',
      section: '테마',
      handler: () => {
        setThemeSetting("system");
      },
    },];
