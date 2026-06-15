import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

header_idx = html.find('</header>') + 9
footer_start = html.find('<footer class="main-footer">')
footer_end = html.find('</footer>', footer_start) + 9

if header_idx != -1 and footer_start != -1:
    header = html[:header_idx]
    
    modal_start = html.find('<!-- Modals -->')
    if modal_start != -1:
        footer = html[footer_start:footer_end] + "\n    </div>\n    <script src=\"js/script.js\"></script>\n</body>\n</html>"
    else:
        footer = html[footer_start:]
    
    body = """
    <main class="case-study-main">
        <header class="case-study-header">
            <div class="case-study-top">
                <a href="index.html" class="case-study-back">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    Back
                </a>
                <span class="case-study-tag">Web &bull; Branding</span>
            </div>
            <h1 class="case-study-title">Building the digital identity for a football scouting organisation that means business.</h1>
            <p class="case-study-subtitle">UDe Sports Management Limited came with a clear mission — connect Nigerian football talent to global opportunities. What they needed was a brand and digital presence serious enough to open the right doors. I delivered a full identity system, brand guidelines, a reference website and an admin dashboard, built on a dark, editorial design language made to command attention.</p>
        </header>

        <div class="case-study-hero">
            <img src="images/ude-hero.png" alt="UDE Sports Hero Image" />
        </div>

        <section class="case-study-section">
            <h2 class="case-study-heading">The Intro</h2>
            <div class="case-study-content">
                <p>UDE Sports Management Limited is a Nigerian football scouting organisation with serious ambitions. They sit at the intersection of local talent and global clubs identifying players, managing careers, and brokering the kind of opportunities that change lives. But their digital presence didn't reflect any of that weight. The brand needed to catch up to the vision.</p>
                <p>The brief covered everything: brand identity, a token-driven design system, brand guidelines documentation, a reference website, and an admin dashboard for internal operations. It was a full-stack brand build, and it needed to feel authoritative from the first pixel.</p>
            </div>
        </section>
        
        <div class="case-study-marquee-container">
            <div class="case-study-marquee">
                <img src="images/udesports/image1.png" alt="Intro Image" />
                <img src="images/udesports/image1.png" alt="Intro Image" />
            </div>
        </div>

        <section class="case-study-section">
            <h2 class="case-study-heading">The Challenge</h2>
            <div class="case-study-content">
                <p>Football scouting in Nigeria operates largely on reputation and relationships. Organisations like UDe are doing serious, consequential work but without the visual credibility to match, they risk being overlooked by the international clubs and agents they're trying to reach.</p>
                <p>The challenge wasn't just design. It was trust. Every touchpoint from a brand guidelines PDF to a dashboard screen had to signal that this was an organisation operating at the highest level, even before a word was read.</p>
                <p>Specific problems we were solving:</p>
                <ul>
                    <li>No existing brand system. starting entirely from zero.</li>
                    <li>The identity needed to work across digital, print, and motion contexts.</li>
                    <li>The website had to function as a reference and credibility anchor for global partners.</li>
                    <li>The admin dashboard needed to be functional and polished, not an afterthought.</li>
                    <li>Everything had to feel cohesive — one ecosystem, not a collection of disconnected pieces.</li>
                </ul>
            </div>
        </section>
        
        <div class="case-study-marquee-container">
            <div class="case-study-marquee">
                <img src="images/udesports/image2.png" alt="Challenge Image" />
                <img src="images/udesports/image3.png" alt="Challenge Image" />
                <img src="images/udesports/image4.png" alt="Challenge Image" />
                <!-- clone -->
                <img src="images/udesports/image2.png" alt="Challenge Image" />
                <img src="images/udesports/image3.png" alt="Challenge Image" />
                <img src="images/udesports/image4.png" alt="Challenge Image" />
            </div>
        </div>

        <section class="case-study-section">
            <h2 class="case-study-heading">Kick Off</h2>
            <div class="case-study-content">
                <p>The project started with a positioning conversation. Who is UDE Sports talking to? What does a global football club or agent need to feel when they land on the site or open a pitch document? The answer was clear: confidence, competence, and credibility.</p>
                <p>From there we established the creative direction. Dark, editorial, premium. A system that borrowed visual language from elite sports brands not the grassroots aesthetic that dominates Nigerian football online. We wanted UDE to look like they belonged in the same room as the organisations they were pitching to.</p>
                <p>Key decisions made at kick-off:</p>
                <ul>
                    <li>Dark-first design system — deep backgrounds, high contrast, sharp type.</li>
                    <li>Two hero brand colours: Goal Green (#00E87A) and Transfer Gold (#F0B429).</li>
                    <li>Brand guidelines to be delivered as a polished document alongside the visual system.</li>
                </ul>
            </div>
        </section>

        <section class="case-study-section">
            <h2 class="case-study-heading">The Process</h2>
            <div class="case-study-content">
                <p>The build happened in layers. Identity first, then system, then product.</p>
                <p>The identity phase covered logomark exploration, colour palette definition, and typographic scale. The UDE logomark needed to carry meaning — the final direction balanced a strong geometric form with subtle references to movement and football culture, without leaning into cliché.</p>
                <p>Once the identity locked, the design token system was built out — mapping every colour, spacing unit, type style, and component state to named variables. This was critical: the website, dashboard, and any future product all needed to pull from the same source of truth.</p>
                <p>The reference website was designed to function as both a public face and a pitch tool. Clean information architecture, strong hero sections, and a layout built to showcase talent profiles and organisational credibility in equal measure.</p>
                <p>The admin dashboard came last — designed around the internal workflows UDE's team actually uses: player management, scouting reports, event tracking, and communication. Functional, but never clinical. The same dark token system carried through so the internal tool felt like part of the same product family.</p>
            </div>
        </section>

        <section class="case-study-section">
            <h2 class="case-study-heading">Brand Identity</h2>
            <div class="case-study-content">
                <p>The UDE Sports identity system was built to be durable. Not trend-chasing something that could anchor the organisation's credibility for years without needing a refresh every season.</p>
            </div>
        </section>
        
        <div class="case-study-marquee-container">
            <div class="case-study-marquee">
                <img src="images/udesports/image5.png" alt="Identity Image" />
                <img src="images/udesports/image6.png" alt="Identity Image" />
                <img src="images/udesports/image7.png" alt="Identity Image" />
                <img src="images/udesports/image8.png" alt="Identity Image" />
                <img src="images/udesports/image9.png" alt="Identity Image" />
                <img src="images/udesports/image10.png" alt="Identity Image" />
                <img src="images/udesports/image11.png" alt="Identity Image" />
                <!-- clone -->
                <img src="images/udesports/image5.png" alt="Identity Image" />
                <img src="images/udesports/image6.png" alt="Identity Image" />
                <img src="images/udesports/image7.png" alt="Identity Image" />
                <img src="images/udesports/image8.png" alt="Identity Image" />
                <img src="images/udesports/image9.png" alt="Identity Image" />
                <img src="images/udesports/image10.png" alt="Identity Image" />
                <img src="images/udesports/image11.png" alt="Identity Image" />
            </div>
        </div>

        <section class="case-study-section">
            <h2 class="case-study-heading">UI / Screens</h2>
            <div class="case-study-content">
                <p>The reference website and admin dashboard are the two primary digital touchpoints delivered under this project.</p>
                <p>The website leads with the organisation's story — who they are, what they do, and the talent they represent. Sections are structured to serve two audiences simultaneously: the global partner scanning for credibility markers, and the Nigerian player or family looking for a trustworthy path forward.</p>
                <p>The admin dashboard handles the operational layer — player profiles, scouting records, event calendars, and internal communications. The UX prioritises clarity and speed: the team needed to move fast between records without getting lost in the interface.</p>
                <p>Both products run on the same token system, meaning any future expansion — a mobile app, a player-facing portal, a scouting tool — can be built without rebuilding the design foundation.</p>
            </div>
        </section>
        
        <div class="case-study-marquee-container">
            <div class="case-study-marquee">
                <img src="images/udesports/image20.png" alt="UI Image" />
                <img src="images/udesports/image21.png" alt="UI Image" />
                <img src="images/udesports/image22.png" alt="UI Image" />
                <img src="images/udesports/image23.png" alt="UI Image" />
                <img src="images/udesports/image24.png" alt="UI Image" />
                <!-- clone -->
                <img src="images/udesports/image20.png" alt="UI Image" />
                <img src="images/udesports/image21.png" alt="UI Image" />
                <img src="images/udesports/image22.png" alt="UI Image" />
                <img src="images/udesports/image23.png" alt="UI Image" />
                <img src="images/udesports/image24.png" alt="UI Image" />
            </div>
        </div>

        <div class="case-study-quote">
            <div class="case-study-quote-text">"Giving off the sports vibe, we totally love it"</div>
            <div class="case-study-quote-author">Mr Dominic, [Owner, UD Sports Management Limited]</div>
        </div>

        <section class="case-study-section">
            <h2 class="case-study-heading">Closer</h2>
            <div class="case-study-content">
                <p>UDE Sports was a project that demanded seriousness at every level. A scouting organisation that moves in elite football circles can't afford to look like it doesn't belong — and the work we built together makes sure they never do.</p>
                <p>From the logomark to the dashboard, every decision was made in service of one outcome: building a brand that opens doors. That's the job. I'm proud of how it came together.</p>
            </div>
        </section>

        <div class="case-study-credits">
            <div class="credit-item">
                <h4>Creative Designer</h4>
                <p>Ekari Victor Iheomimi</p>
            </div>
            <div class="credit-item">
                <h4>Developer</h4>
                <p>Oscar Chiemeka</p>
            </div>
        </div>

        <div class="case-study-share">
            <h3>Enjoyed reading this? Thank you.</h3>
            <p>This took a bit of work to put together, so if you liked it, I'd really appreciate you sharing it.</p>
            <button class="share-btn">Share</button>
        </div>

    </main>
    """
    
    with open('ude-sports.html', 'w', encoding='utf-8') as out:
        out.write(header)
        out.write(body)
        out.write(footer)
    
    print("ude-sports.html rebuilt beautifully.")
else:
    print("Could not find header or footer.")
