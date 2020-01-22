/**
 * Copyright (c) Codice Foundation
 *
 * <p>This is free software: you can redistribute it and/or modify it under the terms of the GNU
 * Lesser General Public License as published by the Free Software Foundation, either version 3 of
 * the License, or any later version.
 *
 * <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Lesser General Public License for more details. A copy of the GNU Lesser General Public
 * License is distributed along with this program and can be found at
 * <http://www.gnu.org/licenses/lgpl.html>.
 */
package ddf.catalog.migrate.migration.query.template.normalization;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import ddf.catalog.CatalogFramework;
import ddf.catalog.data.Attribute;
import ddf.catalog.data.AttributeRegistry;
import ddf.catalog.data.Metacard;
import ddf.catalog.data.Result;
import ddf.catalog.data.impl.AttributeImpl;
import ddf.catalog.data.types.Core;
import ddf.catalog.filter.FilterBuilder;
import ddf.catalog.migrate.migration.api.DataMigratable;
import ddf.catalog.operation.Query;
import ddf.catalog.operation.QueryRequest;
import ddf.catalog.operation.impl.QueryImpl;
import ddf.catalog.operation.impl.QueryRequestImpl;
import ddf.catalog.operation.impl.UpdateRequestImpl;
import ddf.catalog.source.IngestException;
import ddf.catalog.source.SourceUnavailableException;
import ddf.catalog.util.impl.ResultIterable;
import ddf.security.Subject;
import java.io.ByteArrayInputStream;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.xml.bind.JAXBElement;
import net.opengis.filter.v_2_0.FilterType;
import org.apache.commons.collections.CollectionUtils;
import org.apache.commons.lang.StringUtils;
import org.codice.ddf.catalog.ui.forms.api.FilterNode;
import org.codice.ddf.catalog.ui.forms.builder.JsonModelBuilder;
import org.codice.ddf.catalog.ui.forms.filter.FilterReader;
import org.codice.ddf.catalog.ui.forms.filter.FilterWriter;
import org.codice.ddf.catalog.ui.forms.filter.TransformVisitor;
import org.codice.ddf.catalog.ui.forms.filter.VisitableXmlElementImpl;
import org.codice.ddf.security.common.Security;
import org.codice.gsonsupport.GsonTypeAdapters;
import org.opengis.filter.Filter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class QueryTemplateNormalization implements DataMigratable {

  private static final Logger LOGGER = LoggerFactory.getLogger(QueryTemplateNormalization.class);
  private static final Gson GSON =
      new GsonBuilder()
          .disableHtmlEscaping()
          .registerTypeAdapterFactory(GsonTypeAdapters.LongDoubleTypeAdapter.FACTORY)
          .registerTypeAdapter(Date.class, new GsonTypeAdapters.DateLongFormatTypeAdapter())
          .create();
  private final CatalogFramework catalogFramework;

  private final FilterBuilder filterBuilder;

  private final AttributeRegistry registry;

  private final FilterWriter writer;

  private Security security;

  private static final String QUERY_TEMPLATE_TAG = "query-template";

  private static final String QUERY_TEMPLATE_FILTER = "ui.template-filter";

  private static final String QUERY_FILTER = "filterTree";

  public QueryTemplateNormalization(
      CatalogFramework catalogFramework,
      FilterBuilder filterBuilder,
      FilterWriter writer,
      AttributeRegistry registry,
      Security security) {
    this.catalogFramework = catalogFramework;
    this.filterBuilder = filterBuilder;
    this.writer = writer;
    this.registry = registry;

    this.security = security;
  }

  @Override
  public void migrate() {
    Subject systemSubject = security.runAsAdmin(security::getSystemSubject);

    if (systemSubject == null) {
      LOGGER.debug("An error occurred while attempting to run this migration as admin");
      return;
    }

    systemSubject.execute(this::migrateQueryTemplates);
  }

  private void migrateQueryTemplates() {
    LOGGER.trace("Beginning query template data migration");
    Filter queryTemplatesFilter =
        filterBuilder.attribute(Core.METACARD_TAGS).equalTo().text(QUERY_TEMPLATE_TAG);
    Query queryTemplatesQuery = new QueryImpl(queryTemplatesFilter);
    QueryRequest queryTemplatesQueryRequest = new QueryRequestImpl(queryTemplatesQuery);
    ResultIterable queryTemplates =
        ResultIterable.resultIterable(catalogFramework::query, queryTemplatesQueryRequest);

    List<Metacard> migratedQueryTemplates =
        queryTemplates
            .stream()
            .map(Result::getMetacard)
            .filter(Objects::nonNull)
            .map(this::migrateQueryTemplate)
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    if (CollectionUtils.isNotEmpty(migratedQueryTemplates)) {
      try {
        String[] idArray =
            migratedQueryTemplates.stream().map(Metacard::getId).toArray(String[]::new);

        catalogFramework.update(new UpdateRequestImpl(idArray, migratedQueryTemplates));
      } catch (SourceUnavailableException | IngestException e) {
        LOGGER.debug("An error occurred during workspace metacard batch update", e);
      }
    }
    LOGGER.trace("Finished query template data migration");
  }

  private Metacard migrateQueryTemplate(Metacard metacard) {
    if (metacard == null || !metacard.getTags().contains(QUERY_TEMPLATE_TAG)) {
      return null;
    }
    Attribute attribute = metacard.getAttribute(QUERY_TEMPLATE_FILTER);
    if (attribute == null) {
      return null;
    }
    String uiFilterTemplate = (String) attribute.getValue();
    if (StringUtils.isEmpty(uiFilterTemplate)) {
      return null;
    }

    String convertedFilterTemplate = this.convertFilterTree(uiFilterTemplate);
//    metacard.setAttribute(new AttributeImpl(QUERY_TEMPLATE_FILTER, (Serializable) null));
    metacard.setAttribute(new AttributeImpl(QUERY_FILTER, convertedFilterTemplate));

    return metacard;
  }

  private String convertFilterTree(String filterTemplate) {
    TransformVisitor<FilterNode> visitor = new TransformVisitor<>(new JsonModelBuilder(registry));
    try {
      FilterReader reader = new FilterReader();
      JAXBElement<FilterType> root =
          reader.unmarshalFilter(
              new ByteArrayInputStream(filterTemplate.getBytes(StandardCharsets.UTF_8)));
      VisitableXmlElementImpl.create(root).accept(visitor);
      return GSON.toJson(visitor.getResult());
    } catch (Exception e) {
      LOGGER.debug("Something went wrong");
    }
    return null;
  }
}
