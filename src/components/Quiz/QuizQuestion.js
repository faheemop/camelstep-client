import React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Container, Row, Col, Visible } from "react-grid-system";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "../common/Button/Button";
import { Text } from "../Text/Text";
import { QuizTiles } from "./QuizTiles";
import { QuizCategoryButtons } from "./QuizCategoryButtons";
import { QuizOptionsSwitcher } from "./QuizOptionsSwitcher";
import { useMediaQuery } from "../../hooks/useCurrentScreenWidth";

import "../../pages/quizPage.scss";
import { localizedPath } from "../../helpers/localizedPath";
import { setMainCategory } from "../../features/products/productsSlice";

export const QuizQuestion = React.memo(
  ({ currentStep, numberOfSteps, nextStep, previousStep, question }) => {
    const dispatch = useDispatch();
    const category = useSelector((state) => state.quiz.category);
    const moreThan1024 = useMediaQuery("(min-width: 1024px)");
    const { t, i18n } = useTranslation("application");
    const { language } = i18n;
    const nextQuestion = () => {
      if (currentStep !== numberOfSteps.length - 1) {
        nextStep();
      }
    };
    const calculateLastWord = (string) => {
      const lastWord = string.split(" ").pop();
      return ` ${lastWord}`;
    };

    const showAll = () =>
      category === "coffee"
        ? t("quiz.viewAllCoffees")
        : t("quiz.viewAllProducts");

    const getContent = () => (
      <AnimatePresence exitBeforeEnter initial={false}>
        <motion.div
          key={`${category}}`}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{ height: "100%" }}
        >
          <Container
            fluid
            style={{ height: "100%", paddingTop: "2%", paddingBottom: "2%" }}
            className="quiz"
          >
            <Row style={{ height: "100%" }}>
              <Col style={{ alignSelf: "center" }} lg={6} md={12}>
                {moreThan1024 && <QuizCategoryButtons />}
                <Text
                  type="headline1"
                  highlightedText={calculateLastWord(
                    question.translationName[language]
                  )}
                  highlight="end"
                  className="quiz-question-text"
                >
                  {question.translationName[language]
                    .split(" ")
                    .slice(0, -1)
                    .join(" ")}
                </Text>
                <QuizOptionsSwitcher question={question} />
                <Visible lg xl xxl>
                  <div className="quiz-buttons">
                    {currentStep === 1 ? (
                      <Button
                        text={t("common.next")}
                        type="primary"
                        onClick={() => nextQuestion()}
                        style={{
                          marginInlineEnd: "2.4rem",
                          marginTop: "2.4rem",
                        }}
                      />
                    ) : (
                      <>
                        <Button
                          text={t("common.previous")}
                          type="primary"
                          inverted
                          onClick={() => previousStep()}
                          style={{
                            marginInlineEnd: "2.4rem",
                            marginTop: "2.4rem",
                          }}
                        />
                        <Button
                          text={t("common.next")}
                          type="primary"
                          onClick={() => nextQuestion()}
                          style={{
                            marginInlineEnd: "2.4rem",
                            marginTop: "2.4rem",
                          }}
                        />
                      </>
                    )}
                  </div>
                  <div style={{ marginTop: "10%" }}>
                    <Link
                      to={localizedPath("/")}
                      onClick={() => {
                        const mainCategory =
                          category === "coffee" ? "Coffee" : "Tools";
                        dispatch(setMainCategory(mainCategory));
                      }}
                    >
                      <Text type="btn-p" style={{ color: "#00546F" }}>
                        {showAll()}
                      </Text>
                    </Link>
                  </div>
                </Visible>
              </Col>
              <Col lg={6} md={12}>
                <QuizTiles
                  quizQuestion={question}
                  className="col"
                  language={language}
                  nextQuestion={nextQuestion}
                />
              </Col>
              <Visible xs sm md>
                <Col style={{ margin: "3rem 0", textAlign: "center" }}>
                  <div className="quiz-buttons">
                    {currentStep !== 1 && (
                      <Button
                        text={t("common.previous")}
                        type="primary"
                        inverted
                        onClick={() => previousStep()}
                        style={{ marginInlineEnd: "1rem", marginTop: "1rem" }}
                      />
                    )}
                  </div>
                  <div style={{ margin: "4.7rem 0" }}>
                    <Link
                      to={localizedPath("/")}
                      onClick={() => {
                        const mainCategory =
                          category === "coffee" ? "Coffee" : "Tools";
                        dispatch(setMainCategory(mainCategory));
                      }}
                    >
                      <Text type="btn-p" style={{ color: "#00546F" }}>
                        {showAll()}
                      </Text>
                    </Link>
                  </div>
                </Col>
              </Visible>
            </Row>
          </Container>
        </motion.div>
      </AnimatePresence>
    );

    return <>{getContent()}</>;
  }
);
