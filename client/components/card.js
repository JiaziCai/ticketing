import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { red } from "@material-ui/core/colors";
import LocationOnIcon from "@material-ui/icons/LocationOn";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import Link from "next/link";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    "&:hover": {
      cursor: "pointer",
    },
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

export default function RecipeReviewCard({
  title,
  price,
  date,
  image,
  location,
  owner,
  description,
  link,
  as,
}) {
  const classes = useStyles();

  return (
    <Link href={link} as={as}>
      <Card className={classes.root}>
        <CardHeader
          avatar={
            <Avatar aria-label='recipe' className={classes.avatar}>
              {owner.charAt(0)}
            </Avatar>
          }
          title={title}
          subheader={date.substring(0, 10)}
        />
        <CardMedia className={classes.media} image={image} title={title} />
        <CardContent>
          <Typography variant='body1' color='textSecondary' component=''>
            {description}
          </Typography>
        </CardContent>
        <IconButton aria-label='price'>
          <AttachMoneyIcon />
          {price}
        </IconButton>
        <IconButton aria-label='location'>
          <LocationOnIcon />
          {location}
        </IconButton>
      </Card>
    </Link>
  );
}
