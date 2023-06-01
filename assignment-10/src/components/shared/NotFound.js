import React from "react";
import { Button, Container, Group, Text, Title } from "@mantine/core";
import { useNotFoundStyles } from "utils/customStyles";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const { classes } = useNotFoundStyles();
  const navigate = useNavigate();

  return (
    <Container className={classes.root}>
      <div className={classes.label}>404</div>
      <Title className={classes.title}>Page not found!</Title>
      <Text
        color="dimmed"
        size="lg"
        align="center"
        className={classes.description}
      >
        The page you are looking for could not be found! You may have mistyped
        the address, or the page has been moved to another URL.
      </Text>
      <Group position="center">
        <Button
          variant="subtle"
          size="md"
          onClick={() => navigate("/", { replace: true })}
        >
          Bring me back
        </Button>
      </Group>
    </Container>
  );
};

export default NotFound;
