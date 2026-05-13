import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "./index.less";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(dayjs());

  const birthDateStr = "1999年6月10日";

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 计算距离下一次生日的天数
  const getDaysUntilNextBirthday = (): number => {
    const today = currentTime;
    let nextBirthday = dayjs(`${today.year()}-06-10`);

    // 如果今年的生日已经过了，则计算下一年的生日
    if (nextBirthday.isBefore(today, "day")) {
      nextBirthday = nextBirthday.add(1, "year");
    }

    return nextBirthday.diff(today, "day");
  };

  const daysUntilBirthday = getDaysUntilNextBirthday();
  const isBirthdayToday = daysUntilBirthday === 0;

  const formattedDate = currentTime.format("YYYY年MM月DD日 dddd");
  const formattedTime = currentTime.format("HH:mm:ss");

  return (
    <div className="home-container">
      <div className="stars-container">
        {[...Array(150)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDuration: `${2 + Math.random() * 4}s`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              opacity: 0.3 + Math.random() * 0.7
            }}
          />
        ))}
      </div>

      <div className="content-wrapper">
        <div className="hero-section">
          <div className="floating-hearts">
            <span className="heart">❤️</span>
            <span className="heart">💖</span>
            <span className="heart">💕</span>
            <span className="heart">💗</span>
            <span className="heart">💝</span>
          </div>
          <h1 className="main-title">
            <span className="title-word">南南的专属页面</span>
          </h1>
          <p className="subtitle">与你在一起的每一天，都是最珍贵的礼物</p>
          <div className="date-display">
            <div className="date-card">
              <span className="date-icon">📅</span>
              <span className="date-text">{formattedDate}</span>
            </div>
            <div className="time-card">
              <span className="time-icon">⏰</span>
              <span className="time-text">{formattedTime}</span>
            </div>
          </div>
          {/* 生日祝福特别展示区 */}
          {isBirthdayToday ? (
            <div className="birthday-banner birthday-today">
              <div className="birthday-fireworks">
                <span className="firework">🎉</span>
                <span className="firework">🎂</span>
                <span className="firework">🎈</span>
                <span className="firework">🎊</span>
                <span className="firework">✨</span>
              </div>
              <div className="birthday-message">
                <span className="happy-birthday">🎂 生日快乐！🎂</span>
                <span className="birthday-age">恭喜宝宝18岁生日快乐！</span>
                <span className="birthday-wish">
                  愿宝宝开心快乐，永远被爱 💕
                </span>
              </div>
            </div>
          ) : (
            <div className="birthday-banner birthday-countdown">
              <div className="birthday-info">
                <span className="birthday-label">🎂 生日信息</span>
                <div className="birthday-details">
                  <span className="birth-date">📅 生于 {birthDateStr}</span>
                  <span className="current-age">✨ 今年 18 岁</span>
                </div>
              </div>
              <div className="countdown-container">
                <span className="countdown-label">⏰ 距离下一次生日还有</span>
                <div className="countdown-number">
                  <span className="days">{daysUntilBirthday}</span>
                  <span className="unit">天</span>
                </div>
                <div className="countdown-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${Math.min(100, ((365 - daysUntilBirthday) / 365) * 100)}%`
                      }}
                    />
                  </div>
                  <span className="progress-text">期待下一个特别的日子 ✨</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="menu-section">
          <h2 className="menu-title">✨ 选择一个大冒险叭 ✨</h2>
          <div className="game-cards">
            <div
              className="game-card luckly-card"
              onClick={() => navigate("/luckly")}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-icon">🎁</div>
                  <h3 className="game-name">幸运刮刮乐</h3>
                  <p className="game-description">刮开有惊喜2025.06.10</p>
                  <div className="card-hint">点击进入 →</div>
                </div>
              </div>
            </div>

            <div
              className="game-card map-card"
              onClick={() => navigate("/map")}
            >
              <div className="card-inner">
                <div className="card-front">
                  <div className="card-icon">🧩</div>
                  <h3 className="game-name">拼图大冒险</h3>
                  <p className="game-description">通关有惊喜2026.06.10</p>
                  <div className="card-hint">点击进入 →</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="romantic-decoration">
          <div className="decoration-line"></div>
          <div className="decoration-text">❤️ 永远爱你 ❤️</div>
          <div className="decoration-line"></div>
        </div>

        {/* <div className="quote-section">
          <div className="quote-container">
            <div className="quote-icon">"</div>
            <p className="quote-text">
              遇见你是我这辈子最美丽的意外，爱上你是我做过最正确的事。
            </p>
            <div className="quote-author">—— 致我最爱的人</div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default HomePage;
