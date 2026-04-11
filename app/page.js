import ChatWorkspace from '../components/ChatWorkspace';

const pillars = [
  {
    title: '陪伴式对话',
    body: '不再灌鸡汤，而是先接住表达，再逼近真正的问题。'
  },
  {
    title: '日记与回顾',
    body: '把当下经验沉淀成可回看记录，而不是任它在脑中反复翻滚。'
  },
  {
    title: 'ABC 认知分析',
    body: '帮用户分清事件、自动信念与后果，减少把情绪当事实的冲动。'
  },
  {
    title: '风险提醒',
    body: '当内容接近高危边界时，优先回到现实支持，而不是让 AI 装专家。'
  }
];

export default function Page() {
  return (
    <main className="page-root">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      <section className="hero-section">
        <nav className="hero-nav glass-strip">
          <div className="brand-mark">
            <span className="brand-dot" />
            <strong>易伴·心迹</strong>
          </div>
          <div className="nav-links">
            <a href="#features">功能模块</a>
            <a href="#workspace">原型工作台</a>
            <a href="#notes">部署说明</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy glass-card hero-main-card">
            <span className="eyebrow">Emotional companion prototype</span>
            <h1>把“陪聊”做成一套真正能留痕、能反思、能预警的产品闭环</h1>
            <p>
              这不是又一个空泛聊天框：
              对话承接、情绪洞察、日记生成、ABC 分析、风险提醒。
            </p>
            <div className="hero-actions">
              <a className="primary-btn anchor" href="#workspace">直接看原型</a>
              <a className="ghost-btn anchor" href="#notes">看部署步骤</a>
            </div>
            <div className="hero-metrics">
              <div>
                <strong>01</strong>
                <span>单仓库即可部署</span>
              </div>
              <div>
                <strong>02</strong>
                <span>支持 DeepSeek 实时接入</span>
              </div>
              <div>
                <strong>03</strong>
                <span>本地先用 Demo 模式预览</span>
              </div>
            </div>
          </div>

          <div className="hero-side-stack">
            <div className="glass-card portrait-card">
              <div className="portrait-topline">
                <span className="tag">Core Flow</span>
                <span className="mini-chip">MVP</span>
              </div>
              <div className="flow-list">
                <div><span>01</span><p>用户表达今日事件与情绪</p></div>
                <div><span>02</span><p>模型承接并抽取关键冲突</p></div>
                <div><span>03</span><p>生成日记、ABC、反思问题</p></div>
                <div><span>04</span><p>识别风险并提示现实支持</p></div>
              </div>
            </div>
            <div className="glass-card note-card">
              <span className="tag">Reality Check</span>
              <p>
                本产品已在公开网际网络依托vercle公开。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="eyebrow">Product modules</span>
          <h2>每一块都要对用户情绪闭环负责</h2>
        </div>
        <div className="feature-grid">
          {pillars.map((item, index) => (
            <article className="glass-card feature-card" key={item.title}>
              <span className="feature-index">0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <ChatWorkspace />

      <section className="notes-section" id="notes">
        <div className="section-heading narrow">
          <span className="eyebrow">Launch notes</span>
          <h2>公告栏</h2>
        </div>
        <div className="notes-grid">
          <div className="glass-card notes-card">
            <h3>注意</h3>
            <ol>
              <li>本产品仍在实验测试阶段</li>
              <li>如有任何心理不适请及时咨询医生</li>
              <li>本产品旨在心理引导</li>
              <li>测试阶段欢迎各位免费使用</li>
            </ol>
          </div>
          <div className="glass-card notes-card">
            <h3>CAUTION</h3>
            <ol>
              <li>This product is still IN the experimental testing stage.</li>
              <li>If you experience any psychological discomfort, please consult a doctor in a timely manner.</li>
              <li>This product is designed FOR psychological guidance.</li>
              <li>Welcome everyone to use it FOR free during the testing phase.</li>
            </ol>
          </div>
        </div>
      </section>
    </main>
  );
}
