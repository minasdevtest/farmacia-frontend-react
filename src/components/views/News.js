import React, { Component } from 'react';
import Header from '../Header';
import { Typography, Card, CardContent, CardMedia, CardActionArea, Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import FarmaSdk from '../../lib/farmaSDK'
import { WithRoles } from '../../lib/authHOC';
import Loader from 'components/Loader';

/**
 * News Component
 * TODO: FIX thumb https url
 *
 * @class News
 * @extends {Component}
 */
class News extends Component {
    constructor(props) {
        super(props);
        this.sdk = FarmaSdk.instance()
        this.state = {
            loading: true,
            news: []
        }
    }

    fetchNews() {
        this.setState({ loading: true })
        this.sdk.news()
            .then(news => this.setState({ news }))
            .catch(error => console.error(error) || this.setState({ error }))
            .then(() => this.setState({ loading: false }))
    }

    componentDidMount() {
        this.fetchNews()
    }

    render() {
        return (
            <>
                <Header title="Notícias" backButton rightAction={
                    <WithRoles roles="admin">
                        <Button component="a" color="inherit" target="blank" href="http://18.222.72.102:3000/wp-admin/">Ir para o painel</Button>
                    </WithRoles>
                } />
                <main>
                    {this.state.loading ? <Loader /> :
                        this.state.news.map(article =>
                            <Card component="article" key={article.id}
                                style={{ maxWidth: 480, margin: '10px auto' }}>
                                <CardActionArea component={Link} to={`news/${article.id}`}>
                                    {article._embedded['wp:featuredmedia'] &&
                                        <CardMedia
                                            style={{ height: 140 }}
                                            title={article._embedded['wp:featuredmedia'][0].title.rendered}
                                            image={article._embedded['wp:featuredmedia'][0].source_url.replace('https', 'http')} />

                                    }
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="h2">
                                            {article.title.rendered}
                                        </Typography>

                                        <Typography component="div"
                                            dangerouslySetInnerHTML={{ __html: article.excerpt.rendered }} />
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        )}
                </main>
            </>
        );
    }
}

export default News;